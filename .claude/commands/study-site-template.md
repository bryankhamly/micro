# Study Website Template

Use this template to create study websites with the same structure and styling as the Bio 15 Microbiology site.

## Site Structure

```
project/
  index.html              # Landing page with chapter cards
  final-review.html       # Comprehensive study guide with sidebar navigation
  practice.html           # Practice test configuration page
  css/
    styles.css            # Main stylesheet (copy from micro project)
  js/
    main.js               # Navigation and utility functions
    practice-test.js      # Test logic with answer randomization
    questions.json        # Question bank
  handouts/               # Source PDFs for content
```

## HTML Component Patterns

### Review Card (for content sections)
```html
<div class="review-card">
    <h3>Section Title</h3>
    <ul>
        <li><strong>Key Term</strong>: Definition or explanation</li>
    </ul>
</div>
```

### Terms Grid (for vocabulary/definitions)
```html
<div class="terms-grid">
    <div class="term-item">
        <strong>Term Name</strong>
        <span>Definition or description</span>
    </div>
</div>
```

### Comparison Table
```html
<div class="comparison-table">
    <table class="review-table">
        <thead>
            <tr>
                <th>Column 1</th>
                <th>Column 2</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Row Label</strong></td>
                <td>Content</td>
            </tr>
        </tbody>
    </table>
</div>
```

### Quick Facts Box (for high-yield summaries)
```html
<div class="quick-facts">
    <h4>Quick Facts - Topic Name</h4>
    <ul>
        <li><strong>Key point</strong>: Explanation</li>
    </ul>
</div>
```

### Chapter Section with Sidebar Link
```html
<section id="ch1" class="chapter-section">
    <div class="chapter-header-bar">
        <div class="chapter-number">1</div>
        <h2>Chapter Title</h2>
    </div>
    <!-- Content cards go here -->
</section>
```

### Sidebar Navigation Item
```html
<li class="nav-group">Section Group Name</li>
<li><a href="#ch1">Chapter 1: Title</a></li>
```

## Questions JSON Format

```json
{
  "chapters": {
    "chapterId": {
      "name": "Display Name",
      "questions": [
        {
          "question": "Question text here?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "answer": 0
        }
      ]
    }
  }
}
```

### Question Writing Rules
1. Never include parenthetical hints that give away answers
   - BAD: "Conjugation (plasmid transfer)"
   - GOOD: "Conjugation"
2. All 4 options must be plausible distractors
3. Avoid "all of the above" or "none of the above"
4. Answer index is 0-based (0, 1, 2, or 3)
5. Questions should test understanding, not just memorization
6. Ensure questions align with content in the study guide

## Practice Test Features

The practice-test.js includes:
- Answer randomization (Fisher-Yates shuffle) - answers don't stay in same position
- Question selection from multiple chapters
- Score tracking and review mode
- Configurable question count via slider

## Styling Conventions

- Use `var(--primary)` for accent color (cyan/teal)
- Use `var(--surface)` for card backgrounds
- Use `var(--text-primary)` and `var(--text-secondary)` for text
- Highlight key terms with `<strong>` inside `<li>` elements
- Use `<em>` for scientific names (italics)

## Process for New Subject

1. Copy the entire site structure
2. Update page titles and branding
3. Replace content in final-review.html with new subject material
4. Generate new questions for questions.json
5. Update chapter IDs and sidebar navigation
6. Test practice test functionality

## Navbar Structure

```html
<nav class="navbar">
    <div class="nav-brand">
        <a href="index.html">Subject Name</a>
    </div>
    <div class="nav-links">
        <a href="final-review.html">Final Review</a>
        <a href="practice.html">Practice Test</a>
    </div>
</nav>
```
