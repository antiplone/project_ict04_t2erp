package com.spring.erp_ordit.dao.api;

import org.apache.ibatis.annotations.Mapper;

import com.spring.erp_ordit.dto.api.WeatherDTO;

@Mapper
public interface WeatherMapper {
	//
    public int insertWeather(WeatherDTO dto);

	public WeatherDTO selectLatestWeather();
}
