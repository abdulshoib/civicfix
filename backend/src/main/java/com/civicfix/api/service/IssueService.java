package com.civicfix.api.service;

import com.civicfix.api.entity.Issue;
import com.civicfix.api.repository.IssueRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IssueService {

    private final IssueRepository issueRepository;

    public IssueService(IssueRepository issueRepository) {
        this.issueRepository = issueRepository;
    }

    public Issue createIssue(Issue issue) {
        issue.setStatus("REPORTED");
        return issueRepository.save(issue);
    }

    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }

    public Optional<Issue> getIssueById(Long id) {
        return issueRepository.findById(id);
    }

    public Issue updateIssue(Long id, Issue updatedIssue) {
        Issue existingIssue = issueRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Issue not found with ID: " + id));

        existingIssue.setTitle(updatedIssue.getTitle());
        existingIssue.setDescription(updatedIssue.getDescription());
        existingIssue.setCategory(updatedIssue.getCategory());
        existingIssue.setLocation(updatedIssue.getLocation());

        return issueRepository.save(existingIssue);
    }

    public void deleteIssue(Long id) {
        if (!issueRepository.existsById(id)) {
            throw new IllegalArgumentException("Issue not found with ID: " + id);
        }

        issueRepository.deleteById(id);
    }
}
