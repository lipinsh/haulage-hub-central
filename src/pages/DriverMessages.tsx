
import React, { useState, useRef } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, MessageSquare, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

interface FuelPinData {
  [key: string]: {
    pin: string;
    fullReg: string;
  };
}

interface CollectionData {
  loadNumber: string;
  collectionSite: string;
  deliveryDest: string;
  pallets: string;
  driver: string;
  vehicle: string;
  trailer: string;
  notes: string;
  timeFrom: string;
  date: Date | null;
}

const DriverMessages: React.FC = () => {
  const [fuelPinData, setFuelPinData] = useState<FuelPinData>({});
  const [collectionData, setCollectionData] = useState<CollectionData[]>([]);
  const [selectedLoad, setSelectedLoad] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFuelPinFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        const processedData = processFuelPinData(jsonData);
        setFuelPinData(processedData);
        toast({
          title: "Success",
          description: `Successfully loaded ${Object.keys(processedData).length} truck records`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: `Error reading Excel file: ${error}`,
          variant: "destructive",
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const processFuelPinData = (data: any[][]): FuelPinData => {
    const result: FuelPinData = {};
    const headers = data[0] || [];
    const regIndex = headers.findIndex((h: any) => 
      h && h.toString().toLowerCase().includes('registration')
    );
    const pinIndex = headers.findIndex((h: any) => 
      h && h.toString().toLowerCase().includes('pin')
    );

    if (regIndex === -1 || pinIndex === -1) {
      throw new Error('Could not find Registration or Pin columns');
    }

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row && row[regIndex] && row[pinIndex]) {
        const fullReg = row[regIndex].toString().trim();
        const pin = row[pinIndex].toString().trim();
        const shortReg = fullReg.slice(-3);
        result[shortReg] = { pin, fullReg };
      }
    }

    return result;
  };

  const handleCollectionData = (text: string) => {
    if (!text.trim()) {
      setCollectionData([]);
      return;
    }

    try {
      const lines = text.split('\n');
      const headers = lines[0].split('\t');

      const findColumnIndex = (headers: string[], searchTerm: string) => {
        return headers.findIndex(h => 
          h && h.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      };

      const indices = {
        loadNumber: findColumnIndex(headers, 'load'),
        collectionSite: findColumnIndex(headers, 'collection site'),
        deliveryDest: findColumnIndex(headers, 'delivery destination'),
        pallets: findColumnIndex(headers, 'pallets'),
        driver: findColumnIndex(headers, 'driver'),
        vehicle: findColumnIndex(headers, 'vehicle'),
        trailer: findColumnIndex(headers, 'trailer'),
        notes: findColumnIndex(headers, 'notes'),
        timeFrom: findColumnIndex(headers, 'time from'),
        date: findColumnIndex(headers, 'date')
      };

      const result: CollectionData[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cells = lines[i].split('\t');
        if (cells.length > 5 && cells[indices.loadNumber]) {
          result.push({
            loadNumber: cells[indices.loadNumber]?.trim() || '',
            collectionSite: cells[indices.collectionSite]?.trim() || '',
            deliveryDest: cells[indices.deliveryDest]?.trim() || '',
            pallets: cells[indices.pallets]?.trim() || '',
            driver: cells[indices.driver]?.trim() || '',
            vehicle: cells[indices.vehicle]?.trim() || '',
            trailer: cells[indices.trailer]?.trim() || '',
            notes: cells[indices.notes]?.trim() || '',
            timeFrom: cells[indices.timeFrom]?.trim() || '',
            date: parseDate(cells[indices.date]?.trim())
          });
        }
      }

      setCollectionData(result);
      toast({
        title: "Success",
        description: `Parsed ${result.length} collection records`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Error parsing collection data: ${error}`,
        variant: "destructive",
      });
    }
  };

  const parseDate = (dateStr?: string): Date | null => {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
    return new Date(dateStr);
  };

  const generateMessage = () => {
    if (!selectedLoad) {
      toast({
        title: "Error",
        description: "Please select a load number",
        variant: "destructive",
      });
      return;
    }

    const tomorrowDate = new Date(currentDate);
    const todayDate = new Date(tomorrowDate.getTime() - 24 * 60 * 60 * 1000);
    const loadData = collectionData.filter(row => row.loadNumber === selectedLoad);

    if (loadData.length === 0) {
      toast({
        title: "Error",
        description: "No data found for selected load",
        variant: "destructive",
      });
      return;
    }

    const message = buildDriverMessage(loadData, todayDate, tomorrowDate);
    setGeneratedMessage(message);
  };

  const buildDriverMessage = (loadData: CollectionData[], todayDate: Date, tomorrowDate: Date): string => {
    const driverFull = loadData[0].driver;
    const driverFirst = driverFull ? driverFull.split(' ')[0] : 'Driver';
    
    const vehicle = loadData[0].vehicle;
    const trailer = loadData[0].trailer;
    const hasHitchUp = loadData.some(row => 
      row.notes && row.notes.toLowerCase().includes('hitch up')
    );
    
    const fullVehicleReg = fuelPinData[vehicle] ? fuelPinData[vehicle].fullReg : vehicle;
    const fullTrailer = trailer.startsWith('SLH') ? trailer : `SLH${trailer}`;
    const vehicleText = `${fullVehicleReg} ${hasHitchUp ? 'hitch up with' : 'with'} ${fullTrailer}`;
    
    const fuelPin = fuelPinData[vehicle] ? fuelPinData[vehicle].pin : 'XXXX';
    
    const hasTip = loadData.some(row => 
      row.notes && row.notes.toLowerCase().includes('tip')
    );
    
    let tipInstructions = '';
    if (hasTip) {
      const tipRow = loadData.find(row => 
        row.notes && row.notes.toLowerCase().includes('tip')
      );
      const startTime = tipRow ? tipRow.timeFrom : '07:00';
      const tipStartTime = subtractHour(startTime);
      
      tipInstructions = `\nStart at ${tipStartTime}\n\nFirst ${tipRow?.notes}, once empty please start loading from:`;
    }
    
    const todayCollections = loadData.filter(row => 
      row.date && isSameDate(row.date, todayDate)
    );
    const tomorrowCollections = loadData.filter(row => 
      row.date && isSameDate(row.date, tomorrowDate)
    );
    
    let todayText = '';
    if (todayCollections.length > 0) {
      todayText = '\nToday please load from: \n' + 
        todayCollections.map(row => 
          `${row.collectionSite.replace(/^[^-]*-/, '')}  ${row.pallets}p  ${row.deliveryDest}`
        ).join('\n');
    }
    
    let tomorrowText = '';
    if (tomorrowCollections.length > 0) {
      const earliestTime = Math.min(...tomorrowCollections.map(row => 
        timeToMinutes(row.timeFrom)
      ));
      const timeStr = minutesToTime(earliestTime);
      
      tomorrowText = `\n\nTomorrow, please be at your first collection site for ${timeStr}. Please plan your start time accordingly.\nCollections list:\n` + 
        tomorrowCollections.map(row => 
          `${row.collectionSite.replace(/^[^-]*-/, '')}  ${row.pallets}p  ${row.deliveryDest}`
        ).join('\n');
    }
    
    const destinations = [...new Set(loadData.map(row => row.deliveryDest))];
    const deliveryText = buildDeliveryRouting(destinations);
    
    const bookingRefs = loadData
      .filter(row => 
        row.deliveryDest.includes('Morrisons') && 
        row.notes && row.notes.includes('X01')
      )
      .map(row => `${row.deliveryDest} booking ref: ${row.notes}`)
      .join('\n');
    
    let message = `Hi ${driverFirst},\n${vehicleText}\nFuel Pin: ${fuelPin}`;
    
    if (hasTip) {
      message += tipInstructions;
    }
    
    if (todayText) {
      message += '\n' + todayText;
    }
    
    message += tomorrowText;
    message += `\n\nOnce loaded please deliver ${deliveryText}.`;
    
    if (bookingRefs) {
      message += '\n\n' + bookingRefs;
    }
    
    message += '\n\nOnce empty please give the office a call.\nPlease confirm.\nThank you.';
    
    return message;
  };

  const buildDeliveryRouting = (destinations: string[]): string => {
    const sortedDests = [...destinations].reverse();
    
    if (sortedDests.length === 1) {
      return `to ${sortedDests[0]}`;
    } else if (sortedDests.length === 2) {
      return `first to ${sortedDests[0]}, then to ${sortedDests[1]}`;
    } else if (sortedDests.length === 3) {
      return `first to ${sortedDests[0]}, then to ${sortedDests[1]}, and finally to ${sortedDests[2]}`;
    } else {
      const middle = sortedDests.slice(1, -1).map(d => `then to ${d}`).join(', ');
      return `first to ${sortedDests[0]}, ${middle}, and finally to ${sortedDests[sortedDests.length - 1]}`;
    }
  };

  const subtractHour = (timeStr: string): string => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const newHours = hours - 1;
    return `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  const isSameDate = (date1: Date, date2: Date): boolean => {
    return date1.toDateString() === date2.toDateString();
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(generatedMessage);
      setCopied(true);
      toast({
        title: "Success",
        description: "Message copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy message",
        variant: "destructive",
      });
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const textarea = document.getElementById('collectionData') as HTMLTextAreaElement;
      if (textarea) {
        textarea.value = text;
        handleCollectionData(text);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to access clipboard. Please paste manually using Ctrl+V",
        variant: "destructive",
      });
    }
  };

  const loadNumbers = [...new Set(collectionData.map(row => row.loadNumber))]
    .sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-900">Driver Message Generator</h1>
        </div>
        <p className="text-gray-600">Upload fuel pin data and generate driver messages from collection plans</p>

        {/* Step 1: Upload Fuel Pin File */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Step 1: Upload Fuel Pin File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-600 mb-2">Click to upload or drag & drop your Excel file</p>
              <p className="text-gray-500 mb-4">Cab Phone Numbers + Fuel Pins.xlsx</p>
              <Button type="button">Choose File</Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFuelPinFile}
              className="hidden"
            />
            {Object.keys(fuelPinData).length > 0 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800">
                  ✅ Successfully loaded {Object.keys(fuelPinData).length} truck records
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Paste Collection Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Step 2: Paste Collection Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Copy and paste your collection plan data from Excel (including headers)</p>
            <Button 
              onClick={pasteFromClipboard} 
              className="mb-4"
              variant="outline"
            >
              📋 Quick Paste from Clipboard
            </Button>
            <Textarea
              id="collectionData"
              placeholder="Paste your Excel data here...

Example format:
Load Number	Collection Site	Delivery Destination	Pallets Ordered	Driver	Vehicle	Trailer	Notes	Planned Collect Time From	Planned Collect Time By	Deadline Time	Collection Site Arrival Date
1	GHS-Greenhouse Growers (Eric Wall)	Aldi-Darlington	1	Vygantas Bogusas	XFH	69DD	Hitch up	16:00	17:00	18:00	01/06/2025
..."
              className="min-h-[200px] font-mono text-sm"
              onChange={(e) => handleCollectionData(e.target.value)}
            />
            {collectionData.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800">
                  ✅ Parsed {collectionData.length} collection records
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 3: Generate Message */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Step 3: Generate Message
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Load Number:</label>
              <Select value={selectedLoad} onValueChange={setSelectedLoad}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="-- Select Load --" />
                </SelectTrigger>
                <SelectContent>
                  {loadNumbers.map(load => (
                    <SelectItem key={load} value={load}>
                      Load {load}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tomorrow's Date:</label>
              <Input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="w-[200px]"
              />
            </div>
            <Button 
              onClick={generateMessage}
              disabled={Object.keys(fuelPinData).length === 0 || collectionData.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              Generate Message
            </Button>
          </CardContent>
        </Card>

        {/* Step 4: Edit and Copy */}
        {generatedMessage && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Copy className="h-5 w-5" />
                Step 4: Edit & Copy Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4 min-h-[300px] font-mono text-sm whitespace-pre-wrap">
                {generatedMessage}
              </div>
              <div className="text-center mt-4">
                <Button 
                  onClick={copyMessage}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? 'Copied!' : 'Copy Message'}
                </Button>
              </div>
            </CardContent>
          </CardContent>
        </Card>
        )}
      </div>
    </Layout>
  );
};

export default DriverMessages;
