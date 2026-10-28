package com.civicfix.api.controller;

import com.civicfix.api.entity.Issue;
import com.civicfix.api.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = "http://localhost:5173")
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Issue createIssue(@Valid @RequestBody Issue issue) {
        return issueService.createIssue(issue);
    }

    @GetMapping
    public List<Issue> getAllIssues() {
        return issueService.getAllIssues();
    }

    @GetMapping("/{id}")
    public Issue getIssueById(@PathVariable Long id) {
        return issueService.getIssueById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Issue not found with ID: " + id));
    }

    @PutMapping("/{id}")
    public Issue updateIssue(
            @PathVariable Long id,
            @Valid @RequestBody Issue issue) {
        return issueService.updateIssue(id, issue);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteIssue(@PathVariable Long id) {
        issueService.deleteIssue(id);
    }
}
