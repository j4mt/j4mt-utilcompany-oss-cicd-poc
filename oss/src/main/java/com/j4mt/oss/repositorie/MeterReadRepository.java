package com.j4mt.oss.repositorie;

import com.j4mt.oss.entitie.MeterRead;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeterReadRepository extends JpaRepository<MeterRead, Long> {

    MeterRead findById(Long aLong);
}
