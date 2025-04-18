package com.spring.erp_ordit.domain;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * 거래 개념
 * 
 * @author YD.전
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Transaction {

	/**
	 * 거래처명
	 */
	private String customer;

	/**
	 * 구분
	 */
	private Map<String, Object> classification;

	/**
	 * 계정을 과목-항목-적요순으로 Mapping해서 가져옵니다.
	 */
	@SuppressWarnings("unchecked")
	public Map<String, Object> getDetails(String type) {
		Map<String, Object> gettingType;
		gettingType = (Map<String, Object>)this.classification.get(type);

		if (gettingType instanceof Map)
			return (Map<String, Object>)this.classification.get(type);

		return null;
	}
}
