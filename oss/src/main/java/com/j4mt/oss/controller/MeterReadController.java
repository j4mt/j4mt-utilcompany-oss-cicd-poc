package com.j4mt.oss.controller;

import com.j4mt.oss.dto.MeterReadForm;
import com.j4mt.oss.entity.MeterRead;
import com.j4mt.oss.repository.MeterReadRepository;
import com.j4mt.oss.util.MyUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class MeterReadController {

    @Autowired
    private MeterReadRepository meterReadRepository;

    @RequestMapping(value = "/meterRead", method = RequestMethod.GET)
    public String meterRead(Model model) {

        model.addAttribute(new MeterReadForm());

        return "meterRead";
    }

    @RequestMapping(value = "/meterRead", method = RequestMethod.POST)
    public String meterRead(@ModelAttribute("meterReadForm") MeterReadForm meterReadForm,
                            BindingResult result, RedirectAttributes redirectAttributes) {

        if (result.hasErrors())
            return "meterRead";

        meterReadRepository.save(
                new MeterRead(
                        MyUtil.getSessionUser(),
                        meterReadForm.getElecRead(),
                        meterReadForm.getGasRead()
                )
        );

        return "redirect:/";
    }
}
