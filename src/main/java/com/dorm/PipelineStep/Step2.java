package com.dorm.PipelineStep;

public class Step2 implements PipelineStep {
    @Override
    public void run() {
        System.out.println("执行 Step2");
    }
}