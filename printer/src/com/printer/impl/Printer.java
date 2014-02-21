package com.printer.impl;

import java.io.File;
import java.io.FileInputStream;

import javax.print.Doc;
import javax.print.DocFlavor;
import javax.print.DocPrintJob;
import javax.print.PrintException;
import javax.print.PrintService;
import javax.print.PrintServiceLookup;
import javax.print.SimpleDoc;
import javax.print.attribute.HashPrintRequestAttributeSet;
import javax.print.attribute.PrintRequestAttributeSet;
import javax.print.attribute.standard.Copies;
import javax.print.attribute.standard.MediaSizeName;
import javax.print.event.PrintJobEvent;
import javax.print.event.PrintJobListener;

import org.apache.log4j.Logger;

public class Printer implements IPrinter {
	Logger logger = Logger.getLogger(Printer.class);

	public void print(String path, PrintJobListener listener)
			throws Exception {
		DocFlavor flavor = DocFlavor.INPUT_STREAM.PDF;
		PrintRequestAttributeSet pras = new HashPrintRequestAttributeSet();
		pras.add(new Copies(1));
		pras.add(MediaSizeName.ISO_A6);
		// pras.add(new PrinterResolution(300,300,PrinterResolution.DPI));
		PrintService pss[] = PrintServiceLookup.lookupPrintServices(flavor,
				pras);
		if (pss.length > 0) {
			PrintService ps = pss[0];
			logger.info("printing  " + path + " (" + path + ")");
			DocPrintJob job = ps.createPrintJob();
			FileInputStream fin = new FileInputStream(new File(path));
			Doc doc = new SimpleDoc(fin, flavor, null);
			// job.addPrintJobListener();
			try {
				job.print(doc, pras);
			} catch (PrintException e) {
				listener.printJobFailed(new PrintJobEvent(job,PrintJobEvent.JOB_FAILED));
				logger.error(e.getMessage());
			} finally {
				fin.close();
			}
		} else {
			throw new Exception("no printers detected");
		}
	}
}
