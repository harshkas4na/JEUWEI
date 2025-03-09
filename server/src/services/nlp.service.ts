// src/services/nlp.service.ts
import { Activity, ActivityCategory } from '../types';

export const nlpService = {
  /**
   * Process text with basic NLP techniques
   */
  async processText(text: string): Promise<string> {
    // Simple text cleaning
    return text.trim();
  },
  
  /**
   * Extract activities from processed text
   */
  async extractActivities(text: string): Promise<Omit<Activity, 'id' | 'journalId' | 'date'>[]> {
    const activities: Omit<Activity, 'id' | 'journalId' | 'date'>[] = [];
    
    // Define activity patterns for more accurate matching
    const patterns = [
      {
        // Exercise/workout patterns
        regex: /(?:ran|jogged|walked|exercised|worked out|went to the gym|did yoga|did pilates|meditated)(?:\s+for\s+(\d+)\s+(?:min(?:ute)?s?|hours?))?\b/i,
        category: 'habits' as ActivityCategory,
        baseExp: 10,
        expMultiplier: (match: RegExpMatchArray) => match[1] ? Math.min(parseInt(match[1]) / 15, 3) : 1
      },
      {
        // Reading/learning patterns
        regex: /(?:read|studied|learned|took a course|watched a tutorial)(?:\s+(?:about|on)\s+(\w+(?:\s+\w+)*))?(?:\s+for\s+(\d+)\s+(?:min(?:ute)?s?|hours?))?\b/i,
        category: 'knowledge' as ActivityCategory,
        baseExp: 15,
        expMultiplier: (match: RegExpMatchArray) => match[2] ? Math.min(parseInt(match[2]) / 30, 3) : 1
      },
      {
        // Finance patterns
        regex: /(?:budgeted|saved|invested|tracked expenses|reviewed finances|paid bills)(?:\s+(\$\d+(?:\.\d+)?))?/i,
        category: 'financial' as ActivityCategory,
        baseExp: 15,
        expMultiplier: (_match: RegExpMatchArray) => 1
      },
      {
        // Skill development patterns
        regex: /(?:practiced|coded|programmed|developed|built|created|designed|wrote)(?:\s+(?:a|an)\s+(\w+(?:\s+\w+)*))?(?:\s+for\s+(\d+)\s+(?:min(?:ute)?s?|hours?))?\b/i,
        category: 'skills' as ActivityCategory,
        baseExp: 20,
        expMultiplier: (match: RegExpMatchArray) => match[2] ? Math.min(parseInt(match[2]) / 45, 2.5) : 1
      },
      {
        // Experience patterns
        regex: /(?:visited|traveled to|explored|went to|attended|experienced)(?:\s+(?:the|a|an)\s+(\w+(?:\s+\w+)*))?/i,
        category: 'experiences' as ActivityCategory,
        baseExp: 25,
        expMultiplier: (_match: RegExpMatchArray) => 1
      },
      {
        // Networking patterns
        regex: /(?:met with|connected with|talked to|had a meeting with|networked with|contacted|emailed|called)(?:\s+(\w+(?:\s+\w+)*))?/i,
        category: 'network' as ActivityCategory,
        baseExp: 15,
        expMultiplier: (_match: RegExpMatchArray) => 1
      }
    ];
    
    // Split text into sentences
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    sentences.forEach(sentence => {
      const trimmedSentence = sentence.trim();
      let foundMatch = false;
      
      // Try to match patterns first
      for (const pattern of patterns) {
        const match = trimmedSentence.match(pattern.regex);
        
        if (match) {
          const expValue = Math.round(pattern.baseExp * pattern.expMultiplier(match));
          
          activities.push({
            action: trimmedSentence,
            category: pattern.category,
            expValue: Math.min(expValue, 35) // Cap at 35 EXP per activity
          });
          
          foundMatch = true;
          break;
        }
      }
      
      // If no pattern match, try keyword matching
      if (!foundMatch) {
        const categoryMatches = this.matchCategoryKeywords(trimmedSentence);
        
        if (categoryMatches.category) {
          activities.push({
            action: trimmedSentence,
            category: categoryMatches.category,
            expValue: Math.min(categoryMatches.score * 3, 20) // Score-based EXP, capped at 20
          });
        }
      }
    });
    
    return activities;
  },
  
  /**
   * Match category keywords in text
   */
  matchCategoryKeywords(text: string): { category: ActivityCategory | null; score: number } {
    const lowerText = text.toLowerCase();
    
    // Category keywords with weights
    const categoryKeywords: Record<ActivityCategory, Array<{ word: string; weight: number }>> = {
      financial: [
        { word: 'money', weight: 2 },
        { word: 'budget', weight: 3 },
        { word: 'finance', weight: 3 },
        { word: 'invest', weight: 3 },
        { word: 'save', weight: 2 },
        { word: 'expense', weight: 2 },
        { word: 'bill', weight: 1 },
        { word: 'income', weight: 2 }
      ],
      habits: [
        { word: 'exercise', weight: 3 },
        { word: 'workout', weight: 3 },
        { word: 'gym', weight: 2 },
        { word: 'habit', weight: 3 },
        { word: 'routine', weight: 2 },
        { word: 'meditate', weight: 3 },
        { word: 'sleep', weight: 2 },
        { word: 'healthy', weight: 2 }
      ],
      knowledge: [
        { word: 'learn', weight: 3 },
        { word: 'read', weight: 2 },
        { word: 'study', weight: 3 },
        { word: 'book', weight: 2 },
        { word: 'course', weight: 3 },
        { word: 'research', weight: 3 },
        { word: 'article', weight: 1 },
        { word: 'tutorial', weight: 2 }
      ],
      skills: [
        { word: 'practice', weight: 3 },
        { word: 'code', weight: 3 },
        { word: 'develop', weight: 2 },
        { word: 'create', weight: 2 },
        { word: 'build', weight: 2 },
        { word: 'skill', weight: 3 },
        { word: 'project', weight: 2 },
        { word: 'program', weight: 3 }
      ],
      experiences: [
        { word: 'travel', weight: 3 },
        { word: 'visit', weight: 2 },
        { word: 'explore', weight: 3 },
        { word: 'adventure', weight: 3 },
        { word: 'try', weight: 1 },
        { word: 'experience', weight: 3 },
        { word: 'event', weight: 2 },
        { word: 'new', weight: 1 }
      ],
      network: [
        { word: 'meet', weight: 2 },
        { word: 'connection', weight: 3 },
        { word: 'friend', weight: 2 },
        { word: 'network', weight: 3 },
        { word: 'social', weight: 2 },
        { word: 'contact', weight: 2 },
        { word: 'colleague', weight: 2 },
        { word: 'conversation', weight: 2 }
      ]
    };
    
    // Calculate score for each category
    const scores: Record<ActivityCategory, number> = {
      financial: 0,
      habits: 0,
      knowledge: 0,
      skills: 0,
      experiences: 0,
      network: 0
    };
    
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      for (const { word, weight } of keywords) {
        if (lowerText.includes(word)) {
          scores[category as ActivityCategory] += weight;
        }
      }
    }
    
    // Find highest scoring category
    let highestCategory: ActivityCategory | null = null;
    let highestScore = 0;
    
    for (const [category, score] of Object.entries(scores)) {
      if (score > highestScore) {
        highestScore = score;
        highestCategory = category as ActivityCategory;
      }
    }
    
    // Require a minimum score to match
    if (highestScore < 2) {
      return { category: null, score: 0 };
    }
    
    return { category: highestCategory, score: highestScore };
  }
};