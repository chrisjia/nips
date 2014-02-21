package com.printer.impl;

import javax.print.event.PrintJobListener;

public interface IPrinter {
	void print(String path,PrintJobListener listener) throws Exception;
}
