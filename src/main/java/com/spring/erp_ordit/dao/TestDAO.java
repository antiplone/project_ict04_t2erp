package com.spring.erp_ordit.dao;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface TestDAO { // mappers/TestMapper.xml에 연결되어 있습니다.

	public String getMem();
	public String getEmp();
}
