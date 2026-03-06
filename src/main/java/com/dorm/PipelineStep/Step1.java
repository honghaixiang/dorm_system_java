package com.dorm;

import org.springframework.stereotype.Component;

@Component
public class Step1 implements PipelineStep {
    @Override
    public void run(String data) {
        System.out.println("【步骤1】检查数据是否为空: " + data);
    }
}