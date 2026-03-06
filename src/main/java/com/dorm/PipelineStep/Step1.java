package com.dorm.PipelineStep;

public class Step1 implements PipelineStep {
    @Override
    public void run() {
        System.out.println("执行 Step1");
    }
}