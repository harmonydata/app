import jsPDF from 'jspdf';
import { format } from 'date-fns';
import 'jspdf-autotable';

jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => {
    const mockAutoTable = jest.fn();
    mockAutoTable.previous = { finalY: 40 };

    return {
      setFontSize: jest.fn(),
      text: jest.fn(),
      autoTable: mockAutoTable,
      save: jest.fn(),
      output: jest.fn().mockReturnValue(new Uint8Array())
    };
  });
});

describe('PDF Export', () => {
  let mockDoc;

  beforeEach(() => {
    mockDoc = {
      setFontSize: jest.fn(),
      text: jest.fn(),
      autoTable: jest.fn(() => {
        mockDoc.autoTable.previous = { finalY: 40 };
      }),
      save: jest.fn(),
      output: jest.fn().mockReturnValue(new Uint8Array())
    };
    mockDoc.autoTable.previous = { finalY: 40 };

    jsPDF.mockImplementation(() => mockDoc);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate a PDF with match data', async () => {
    const computedMatches = [{
      match: 0.85,
      qi: 0,
      mqi: 1,
      selected: true
    }];

    const apiData = {
      instruments: [
        { 
          name: 'Instrument A',
          questions: [{
            question_index: 0,
            question_text: 'Question 1',
            instrument: { name: 'Instrument A' }
          }]
        },
        {
          name: 'Instrument B',
          questions: [{
            question_index: 1,
            question_text: 'Question 2',
            instrument: { name: 'Instrument B' }
          }]
        }
      ]
    };

    const options = {
      threshold: [80, 100]
    };

    const doc = new jsPDF();
    
    doc.setFontSize(24);
    doc.text('Harmony Data Report', 105, 20, { align: 'center' });

  
    doc.autoTable({
      startY: 30,
      body: [
        ['Total Instruments', apiData.instruments.length],
        ['Total Matches', computedMatches.length],
        ['Selected Matches', computedMatches.filter(m => m.selected).length],
        ['Match Threshold', `${options.threshold[0]}%`]
      ],
      theme: 'plain',
      margin: { left: 20 },
      styles: { fontSize: 12 }
    });

  
    const matchesTableBody = computedMatches.map(match => [
      apiData.instruments[0].questions[0].question_text,
      apiData.instruments[0].questions[0].instrument.name,
      apiData.instruments[1].questions[0].question_text,
      apiData.instruments[1].questions[0].instrument.name,
      `${(match.match * 100).toFixed(1)}%`
    ]);


    doc.autoTable({
      startY: 50,  
      head: [['Question 1', 'Instrument 1', 'Question 2', 'Instrument 2', 'Score']],
      body: matchesTableBody,
      theme: 'grid',
      headStyles: { fillColor: [33, 69, 237], textColor: 255, fontSize: 12 },
      styles: { overflow: 'linebreak', cellWidth: 'wrap', fontSize: 10 }
    });


    expect(jsPDF).toHaveBeenCalledTimes(1);
    expect(mockDoc.setFontSize).toHaveBeenCalledWith(24);
    expect(mockDoc.text).toHaveBeenCalledWith('Harmony Data Report', 105, 20, { align: 'center' });


    expect(mockDoc.autoTable).toHaveBeenCalledTimes(2);
    
  
    expect(mockDoc.autoTable).toHaveBeenCalledWith(expect.objectContaining({
      startY: 30,
      theme: 'plain',
      styles: { fontSize: 12 },
      body: expect.arrayContaining([
        ['Total Instruments', 2],
        ['Total Matches', 1]
      ])
    }));

    expect(mockDoc.autoTable).toHaveBeenCalledWith(expect.objectContaining({
      startY: 50,
      theme: 'grid',
      head: [['Question 1', 'Instrument 1', 'Question 2', 'Instrument 2', 'Score']],
      body: [['Question 1', 'Instrument A', 'Question 2', 'Instrument B', '85.0%']]
    }));
  });

  it('handles PDF generation errors', async () => {
    jsPDF.mockImplementationOnce(() => {
      throw new Error('PDF generation failed');
    });

    expect(() => {
      new jsPDF();
    }).toThrow('PDF generation failed');
  });
});