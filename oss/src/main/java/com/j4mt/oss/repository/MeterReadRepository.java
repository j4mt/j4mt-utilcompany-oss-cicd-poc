package com.j4mt.oss.repository;

import com.j4mt.oss.entity.MeterRead;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeterReadRepository extends JpaRepository<MeterRead, Long> {

    MeterRead findById(Long aLong);
}
