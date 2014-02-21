package com.nip.api;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.protocol.HTTP;
import org.apache.log4j.Logger;

import com.common.Configuration;

public class NipsRes {
	Logger logger = Logger.getLogger(NipsRes.class);
	String name = "";

	public NipsRes(String path) {
		String tmp[] = path.split("//");
		if (tmp.length > 1) {
			this.name = tmp[tmp.length - 1];
		} else {
			this.name = path;
		}
	}

	protected String download(String url, List<NameValuePair> params) {
		HttpClient httpClient = new DefaultHttpClient();
		HttpPost post = new HttpPost(url);
		try {
			if (params != null)
				post.setEntity(new UrlEncodedFormEntity(params, HTTP.UTF_8));
			HttpResponse resp = httpClient.execute(post);
			if (resp.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
				HttpEntity entity = resp.getEntity();
				InputStream in = entity.getContent();
				try {
					String dirPath = Configuration.instance().get("tmp_dir");
					File dir = new File(dirPath);
					if (dir == null || !dir.exists()) {
						dir.mkdirs();
					}
					String realPath = dirPath.concat(this.name);
					File file = new File(realPath);
					if (file == null || !file.exists()) {
						file.createNewFile();
					}
					FileOutputStream fos = new FileOutputStream(file);
					byte[] buf = new byte[1024 * 10];
					int len = 0;
					while ((len = in.read(buf)) != -1) {
						fos.write(buf, 0, len);
					}
					fos.flush();
					fos.close();
					return realPath;
				} catch (IOException e) {
					e.printStackTrace();
				} finally {
					try {
						in.close();
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
			} else {
				logger.error("http request got error:"
						+ resp.getStatusLine().getStatusCode());
			}
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return null;
	}
}
