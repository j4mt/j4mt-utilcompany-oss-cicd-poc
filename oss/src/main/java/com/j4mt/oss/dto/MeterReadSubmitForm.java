package com.j4mt.oss.dto;

import com.j4mt.oss.entity.MeterRead;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

public class MeterReadSubmitForm {

    @NotNull
    @Size(min=6, max= MeterRead.METER_MAX, message="{meterReadError}")
    @Pattern(regexp=MeterRead.METER_PATTERN, message="{meterPatternError}")
    private String elecRead;

    @NotNull
    @Size(min=6, max=MeterRead.METER_MAX, message="{meterReadError}")
    @Pattern(regexp=MeterRead.METER_PATTERN, message="{meterPatternError}")
    private String gasRead;

    public void submitRead(String elecRead, String gasRead){
        this.elecRead = elecRead;
        this.gasRead = gasRead;
    }
}
