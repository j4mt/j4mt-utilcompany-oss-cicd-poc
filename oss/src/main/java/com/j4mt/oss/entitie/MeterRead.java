package com.j4mt.oss.entitie;

import javax.persistence.*;

@Entity
@Table(name = "METER_READ", indexes = {
        @Index(columnList = "ID", unique = true),
})
public class MeterRead {

    public static final int METER_MAX = 7;

    public static final String METER_PATTERN = "[0-9._%-+]+@[0-9.-]";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, length = METER_MAX)
    private String electricRead;

    @Column(nullable = false, length = METER_MAX)
    private String gasRead;

    public MeterRead(String electricRead, String gasRead) {
        this.electricRead = electricRead;
        this.gasRead = this.gasRead;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getElectricRead() {
        return electricRead;
    }

    public void setElectricRead(String electricRead) {
        this.electricRead = electricRead;
    }

    public String getGasRead() {
        return gasRead;
    }

    public void setGasRead(String gasRead) {
        this.gasRead = gasRead;
    }
}
