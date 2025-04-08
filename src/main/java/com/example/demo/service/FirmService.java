package com.example.demo.service;

import com.example.demo.entity.Firm;
import com.example.demo.repository.FirmRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// src/main/java/com/example/demo/service/FirmService.java
@Service
@RequiredArgsConstructor
public class FirmService {
    private final FirmRepository firmRepository;

    // 获取所有企业
    public List<Firm> getAllFirms() {
        return firmRepository.findAll();
    }

    // 创建企业
    public Firm createFirm(Firm firm) {
        return firmRepository.save(firm);
    }

    // 更新企业
    public Firm updateFirm(Long id, Firm firmDetails) {
        Firm firm = firmRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Firm not found"));

        firm.setFirmname(firmDetails.getFirmname());
        return firmRepository.save(firm);
    }

    // 删除企业
    public void deleteFirm(Long id) {
        firmRepository.deleteById(id);
    }
}
