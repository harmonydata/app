import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

export class HarmonyPDFExport {
  constructor() {
    this.doc = new jsPDF();
  }

  async generateReport(data) {
    const {
      matches,
      instruments,
      threshold,
      selectedMatches = []
    } = data;

    // Header
    this.doc.setFontSize(24);
    this.doc.text('Harmony Data Report', 105, 20, { align: 'center' });
    
    // Summary section
    this.addSummarySection({
      totalMatches: matches.length,
      selectedMatches: selectedMatches.length,
      instrumentCount: instruments.length,
      threshold
    });

    // Matches table
    this.addMatchesTable(matches, selectedMatches);

    return this.doc.output('blob');
  }

  addSummarySection(summary) {
    const summaryData = [
      ['Generated', format(new Date(), 'PPpp')],
      ['Total Instruments', summary.instrumentCount],
      ['Total Matches', summary.totalMatches],
      ['Selected Matches', summary.selectedMatches],
      ['Match Threshold', `${summary.threshold}%`]
    ];

    this.doc.autoTable({
      startY: 30,
      head: [],
      body: summaryData,
      theme: 'plain',
      margin: { left: 20 },
      styles: { fontSize: 12 }
    });
  }

  addMatchesTable(matches, selectedMatches) {
    const tableData = matches.map(match => [
      match.question1.question_text,
      match.question1.instrument_name,
      match.question2.question_text,
      match.question2.instrument_name,
      `${(match.score * 100).toFixed(1)}%`
    ]);

    this.doc.autoTable({
      startY: this.doc.autoTable.previous.finalY + 20,
      head: [['Question 1', 'Instrument 1', 'Question 2', 'Instrument 2', 'Score']],
      body: tableData,
      theme: 'grid',
      headStyles: { 
        fillColor: [33, 69, 237],
        textColor: 255,
        fontSize: 12
      },
      styles: { 
        overflow: 'linebreak',
        cellWidth: 'wrap',
        fontSize: 10
      }
    });
  }
}