package tests;

import org.apache.log4j.Logger;

import com.printer.task.Job;
import com.printer.task.JobGetter;

public class PrintMain {
	static Logger logger = Logger.getLogger(PrintMain.class);

	public static void main(String[] args) {
		for (Job j : JobGetter.instance().get(null,1)) {
			j.execute();
		}
	}
}
