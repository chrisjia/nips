package com.printer.task.sch;

import org.apache.log4j.Logger;

import com.common.PrintService;
import com.common.Configuration;
import com.printer.task.Job;
import com.printer.task.JobGetter;

public class PullScheduler implements Runnable {
	static Logger logger = Logger.getLogger(PullScheduler.class);
	long update_schedule = 1000 * 15;
	String workername = "";
	boolean running = true;

	public void start() {
		running = true;
		new Thread(this).start();
	}

	public void stop() {
		running = false;
	}

	public void run() {
		String interval = Configuration.instance().get(
				"pull_interval");
		workername = Configuration.instance().get("workername");
		update_schedule = Long.valueOf(interval) * 1000;
		logger.info("job scheduler started with interval:" + interval + " s");
		while (PrintService.running && running) {
			try {
				for (Job job : JobGetter.instance().get(null, 1)) {
					job.execute();
				}
				logger.info("next scheduler after " + String.valueOf(interval)
						+ " seconds");
				Thread.sleep(update_schedule);
			} catch (Exception e) {
				logger.error(e.getMessage());
			}
		}
	}
}
