package com.spring.erp_ordit.domain;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * 계정 개념
 * 
 * @author YD.전
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Account {

	/**
	 * 과목
	 */
	private String subjects;

	/**
	 * 항목
	 */
	private String entries;

	/**
	 * 적요
	 */
	private List<String> description;

	/**
	 * 계정을 과목-항목-적요순으로 Mapping해서 가져옵니다.
	 */
	public Map<String, Object> getDetails() {

		Map<String, Object> details = Map.ofEntries(
			Map.entry("subjects", this.subjects),
			Map.entry("entreis", this.entries),
			Map.entry("description", this.description)
		);

		return details;
	}
}
