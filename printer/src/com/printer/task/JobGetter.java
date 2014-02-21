package com.printer.task;

import java.util.ArrayList;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.apache.log4j.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.nip.api.NipsRequest;

public class JobGetter extends NipsRequest {
	static Logger logger = Logger.getLogger(JobGetter.class);
	static JobGetter _instance = null;

	public static JobGetter instance() {
		if (_instance == null) {
			_instance = new JobGetter();
		}
		return _instance;
	}

	private JobGetter() {

	}

	public ArrayList<Job> get(String id, int n) {
		ArrayList<NameValuePair> params = new ArrayList<NameValuePair>();
		params.add(new BasicNameValuePair("status", "1"));
		params.add(new BasicNameValuePair("n", String.valueOf(n)));
		if (id != null)
			params.add(new BasicNameValuePair("rid", id));
		JSONObject results = this.sq(NipsRequest.BASE_URL + "/api/jobs/get",
				params);
		ArrayList<Job> res = new ArrayList<Job>();
		if (results != null) {
			if (results.get("err") == null) {
				JSONArray jobs = (JSONArray) results.get("results");
				logger.info(String.valueOf(jobs.size()) + " loaded"); 
				for (Object o : jobs) {
					res.add(new Job((JSONObject) o));
				}
			} else {
				logger.error(results.get("err"));
			}
		} else {
			logger.error("network error");
		}
		return res;
	}

}
