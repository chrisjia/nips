package com.printer.task;

public class Address {
	private String _addr = "";

	public String postAddr() {
		return _addr;
	}

	private String _mobi = "";

	public String contactPhNO() {
		return _mobi;
	}

	public Address(String addr, String mobile) {
		this._addr = addr;
		this._mobi = mobile;
	}
}
