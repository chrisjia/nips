package com.nip.api;

import java.util.List;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.apache.log4j.Logger;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.common.Configuration;

public class NipsRequest {
	Logger logger = Logger.getLogger(NipsRequest.class);
	public static final String BASE_URL = Configuration.instance().get(
			"nips_addr");

	protected JSONObject sq(String url, List<NameValuePair> params) {
		HttpClient httpClient = new DefaultHttpClient();
		HttpPost post = new HttpPost(url);
		try {
			if (params != null)
				post.setEntity(new UrlEncodedFormEntity(params, HTTP.UTF_8));
			HttpResponse resp = httpClient.execute(post);
			if (resp.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
				JSONParser parser = new JSONParser();
				try {
					return (JSONObject) parser.parse(EntityUtils.toString(resp
							.getEntity()));
				} catch (ParseException pe) {
					logger.error(pe.getMessage());
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
}
