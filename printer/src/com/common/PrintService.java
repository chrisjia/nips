package com.common;

import org.apache.log4j.Logger;

import com.printer.task.sch.PullScheduler;

public class PrintService {
	static Logger logger = Logger.getLogger(PrintService.class);
	public static boolean running = true;
	
	PullScheduler sch = null;
	public PrintService() {
		Runtime.getRuntime().addShutdownHook(new Thread() {
			public void run() {
				running = false;
				logger.info("service exit!!!");
			}
		});
		sch = new PullScheduler();
		sch.start();
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		PrintService app = new PrintService();
	}
}
