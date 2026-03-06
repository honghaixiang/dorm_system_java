package com.dorm.PipelineStep;

import org.springframework.stereotype.Component;

@Component
public class Step2 implements PipelineStep {
    @Override
    public void run(String data) {
        System.out.println("【步骤2】处理数据: " + data);
        // 你的业务逻辑
    }
}