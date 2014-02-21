package com.printer.task;

import java.util.ArrayList;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import com.nip.api.NipsRequest;
import com.nip.api.NipsRes;

public class Image extends NipsRes {
	String path = "";
	String id = "";

	public Image(String id, String path, long time) {
		super(path);
		this.id = id;
		this.path = path;
	}

	public String load() {
		ArrayList<NameValuePair> params = new ArrayList<NameValuePair>();
		params.add(new BasicNameValuePair("rid", id));
		return this.download(NipsRequest.BASE_URL + "/api/jobs/image", params);
	}
}
