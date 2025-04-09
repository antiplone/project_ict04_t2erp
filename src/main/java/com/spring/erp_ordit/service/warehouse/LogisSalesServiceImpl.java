package com.spring.erp_ordit.service.warehouse;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.erp_ordit.dao.warehouse.LogisMapper;
import com.spring.erp_ordit.dto.warehouse.LogisSalesDTO;

@Service
public class LogisSalesServiceImpl {

@Autowired
private LogisMapper logisMapper;
	
	// 입/출고 목록	
	@Transactional(readOnly=true)
	public List<LogisSalesDTO> logisSalesList(){
		System.out.println("LogisSalesServiceImpl - logisSalesList");
		return logisMapper.logisSalesList();
	}


}
