package com.echo_link.message.controller;

import com.echo_link.message.model.Message;
import com.echo_link.message.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    @Autowired
    private MessageService messageService;

    @PostMapping
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        return ResponseEntity.ok(messageService.sendMessage(message));
    }

    @GetMapping
    public ResponseEntity<List<Message>> getAllMessages() {
        return ResponseEntity.ok(messageService.getAllMessages());
    }
}
