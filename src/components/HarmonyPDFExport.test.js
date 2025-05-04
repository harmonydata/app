jest.mock('jspdf', () => {
    const fakeImpl = () => ({
      internal: {
        getNumberOfPages: jest.fn().mockReturnValue(3),
        pageSize: {
          getWidth: jest.fn().mockReturnValue(210),
          getHeight: jest.fn().mockReturnValue(297),
        },
      },
      setFontSize: jest.fn(),
      text:        jest.fn(),
      autoTable:   jest.fn(function (opts) { this.lastAutoTable = { finalY: 100 } }),
      output:      jest.fn().mockReturnValue('fake-blob'),
    });
    return { __esModule: true, default: jest.fn().mockImplementation(fakeImpl) };
  });
  
 jest.mock('jspdf-autotable', () => ({}));
 
 
 const { HarmonyPDFExport } = require('./HarmonyPDFExport');
 
 
 describe('HarmonyPDFExport', () => {
    let fakeDoc, FakeJsPDF, exporter
    beforeEach(() => {
        fakeDoc = {
        internal: {
            getNumberOfPages: jest.fn().mockReturnValue(3),
            pageSize: {
            getWidth: jest.fn().mockReturnValue(210),
            getHeight: jest.fn().mockReturnValue(297),
            },
        },
        setFontSize: jest.fn(),
        text:        jest.fn(),
        autoTable:   jest.fn(function (opts) { this.lastAutoTable = { finalY: 100 } }),
        output:      jest.fn().mockReturnValue('fake-blob'),
        }
        FakeJsPDF = jest.fn().mockReturnValue(fakeDoc)
        exporter = new HarmonyPDFExport(FakeJsPDF)
    });
 
 
    it('generateReport: should render header, summary, matches table and return blob', async () => {
      const sampleMatch = {
        question1: { question_text: 'Q1 text', instrument_name: 'InstA' },
        question2: { question_text: 'Q2 text', instrument_name: 'InstB' },
        score: 0.756,
      };
      const data = {
        matches: [sampleMatch],
        instruments: ['InstA','InstB','InstC'],
        threshold: 80,
        selectedMatches: [sampleMatch],
      };
       const blob = await exporter.generateReport(data);
      expect(blob).toBe('fake-blob');
       // header
      expect(fakeDoc.setFontSize).toHaveBeenCalledWith(24);
      expect(fakeDoc.text).toHaveBeenCalledWith(
        'Harmony Data Report',
        105, 20,
        { align: 'center' }
      );
       // two tables
      expect(fakeDoc.autoTable).toHaveBeenCalledTimes(2);
       // summary table body
      const summaryOpts = fakeDoc.autoTable.mock.calls[0][0];
      expect(summaryOpts.body).toEqual([
        ['Generated',expect.any(String)],
        ['Total Instruments', 3],
        ['Total Matches',     1],
        ['Selected Matches',  1],
        ['Match Threshold', '80%'],
      ]);
       // matches table body
      const matchOpts = fakeDoc.autoTable.mock.calls[1][0];
      expect(matchOpts.body).toEqual([
        ['Q1 text','InstA','Q2 text','InstB','75.6%']
      ]);
       // footer callback
      matchOpts.didDrawPage();
      expect(fakeDoc.setFontSize).toHaveBeenLastCalledWith(10);
      expect(fakeDoc.text).toHaveBeenLastCalledWith(
        'Page 3',
        190, // 210 - 20
        287, // 297 - 10
        { align: 'right' }
      );
    });
     it('addSummarySection: should call autoTable with exactly the summary data', () => {
      exporter.addSummarySection({
        instrumentCount: 5,
        totalMatches:    2,
        selectedMatches: 1,
        threshold:       42,
      });
       expect(fakeDoc.autoTable).toHaveBeenCalledTimes(1);
      const opts = fakeDoc.autoTable.mock.calls[0][0];
      expect(opts.body[1]).toEqual(['Total Instruments', 5]);
      expect(opts.body[4]).toEqual(['Match Threshold', '42%']);
    });
     it('addMatchesTable: should render matches correctly and attach a footer callback', () => {
      const matches = [
        { question1:{question_text:'foo',instrument_name:'X'}, question2:{question_text:'bar',instrument_name:'Y'}, score:0.5 },
        { question1:{question_text:'baz',instrument_name:'Z'}, question2:{question_text:'qux',instrument_name:'W'}, score:1.0 },
      ];
      exporter.addMatchesTable(matches, []);
      expect(fakeDoc.autoTable).toHaveBeenCalledTimes(1);
       const opts = fakeDoc.autoTable.mock.calls[0][0];
      expect(opts.body).toEqual([
        ['foo','X','bar','Y','50.0%'],
        ['baz','Z','qux','W','100.0%'],
      ]);
      expect(typeof opts.didDrawPage).toBe('function');
    });
 });
 