package com.common;


import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;

public class Configuration {

	private static Configuration _instance;

	public static Configuration instance() {
		if (_instance == null) {
			_instance = new Configuration("config.properties");
		}
		return _instance;
	}

	Properties propertie;

	public Configuration(String path) {
		propertie = new Properties();
		try {
			FileInputStream inputFile = new FileInputStream(path);
			propertie.load(inputFile);
			inputFile.close();
		} catch (FileNotFoundException ex) {
			ex.printStackTrace();
		} catch (IOException ex) {
			ex.printStackTrace();
		}
	}

	public String get(String key){
		if(propertie == null)
			return null;
		return propertie.getProperty(key, null);
	}
}
