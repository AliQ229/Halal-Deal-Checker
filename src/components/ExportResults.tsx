import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { DealInputs, DealResults } from '@/types/calculator';
import ReportTemplate from './ReportTemplate';
import { PdfHeaderPattern } from './PdfHeaderPattern';
import { PdfDocument } from './PdfDocument';
import { pdf } from '@react-pdf/renderer';
import { toPng } from 'html-to-image';

interface ExportResultsProps {
  results: DealResults;
  inputs: DealInputs;
  propertyName: string;
}

export const ExportResults: React.FC<ExportResultsProps> = ({ results, inputs, propertyName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const yieldChartRef = useRef<HTMLDivElement>(null);
  const breakdownChartRef = useRef<HTMLDivElement>(null);
  const headerPatternRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!yieldChartRef.current || !breakdownChartRef.current || !headerPatternRef.current) {
      console.error("Chart refs are not available");
      return;
    }
    setIsLoading(true);

    try {
      const yieldChartUrl = await toPng(yieldChartRef.current, { cacheBust: true, pixelRatio: 2 });
      const breakdownChartUrl = await toPng(breakdownChartRef.current, { cacheBust: true, pixelRatio: 2 });
      const headerPatternUrl = await toPng(headerPatternRef.current, { cacheBust: true, pixelRatio: 2 });

      const images = {
        yieldChart: yieldChartUrl,
        breakdownChart: breakdownChartUrl,
        headerPattern: headerPatternUrl,
      };

      console.log('Debug: Images for PDF:', images);

      const blob = await pdf(
        <PdfDocument 
          results={results} 
          inputs={inputs} 
          propertyName={propertyName} 
          images={images} 
        />
      ).toBlob();

      // Create a clean filename from the property name
      const cleanPropertyName = propertyName
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .trim()
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\s/g, '-') // Replace spaces with hyphens
        .toLowerCase();
      
      const filename = `${cleanPropertyName}-investment-report.pdf`;

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Failed to generate PDF', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleExport} disabled={isLoading} className="w-full">
        {isLoading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
        ) : (
          <><Download className="mr-2 h-4 w-4" /> Export as PDF</>
        )}
      </Button>

      {/* Hidden report for rendering charts to images */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '800px', backgroundColor: 'white', padding: '1rem' }}>
        <div ref={headerPatternRef}>
          <PdfHeaderPattern />
        </div>
        <ReportTemplate 
          chartRefs={{ yieldChartRef, breakdownChartRef }} 
          results={results} 
          inputs={inputs} 
          propertyName={propertyName} 
        />
      </div>
    </div>
  );
};
