package com.spring.erp_ordit.dao.api;

import org.apache.ibatis.annotations.Mapper;

import com.spring.erp_ordit.dto.api.WeatherDTO;

@Mapper
public interface WeatherMapper {
    int insertWeather(WeatherDTO dto);	// 최신 날씨 추가
    WeatherDTO selectLatestWeather();		// 최신 날씨 조회
}