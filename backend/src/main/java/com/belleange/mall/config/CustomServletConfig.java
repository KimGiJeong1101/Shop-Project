package com.belleange.mall.config;

import com.belleange.mall.controller.formatter.LocalDateFormatter;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class CustomServletConfig implements WebMvcConfigurer {

  @Override
  public void addFormatters(FormatterRegistry registry) {

    registry.addFormatter(new LocalDateFormatter()); // 날짜 데이터를 여러 방식으로 표현할 수 있게 해준다.
  }


}