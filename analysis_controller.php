<?php
// controllers/analysis_controller.php - AI analysis controller

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../utils/auth.php';
require_once __DIR__ . '/../utils/response.php';

/**
 * Handle generate AI analysis for an entry
 * 
 * @param Database $db Database connection
 * @param array $params Route parameters
 * @param array $queryParams Query parameters
 * @param array $body Request body
 * @return void
 */
function handleAnalyzeEntry($db, $params, $queryParams, $body) {
    // Get authenticated user
    $user = requireAuth();
    
    // Get entry ID from route parameters
    $entryId = isset($params['id']) ? (int)$params['id'] : 0;
    
    // Check if entry exists and belongs to user
    $entry = $db->getOne(
        "SELECT entry_id, title, content FROM journal_entries WHERE entry_id = ? AND user_id = ?",
        [$entryId, $user['user_id']]
    );
    
    if (!$entry) {
        sendNotFound('Entry not found');
        return;
    }
    
    // Parse request body
    $analyzeMood = isset($body['analyze_mood']) ? (bool)$body['analyze_mood'] : true;
    $analyzeTopics = isset($body['analyze_topics']) ? (bool)$body['analyze_topics'] : true;
    $generateHeroJourney = isset($body['generate_hero_journey']) ? (bool)$body['generate_hero_journey'] : true;
    
    // Perform AI analysis
    // In a real implementation, this would call external AI services or use local libraries
    // For this example, we'll simulate the analysis
    
    $moodAnalysis = null;
    $topicAnalysis = null;
    $heroJourney = null;
    
    if ($analyzeMood) {
        $moodAnalysis = simulateMoodAnalysis($entry['content']);
    }
    
    if ($analyzeTopics) {
        $topicAnalysis = simulateTopicAnalysis($entry['content']);
        
        // Save topics to database
        if (!empty($topicAnalysis['topics'])) {
            // Delete existing topics
            $db->query(
                "DELETE FROM entry_topics WHERE entry_id = ?",
                [$entryId]
            );
            
            // Insert new topics
            foreach ($topicAnalysis['topics'] as $topic) {
                $db->query(
                    "INSERT INTO entry_topics (entry_id, topic, confidence)
                     VALUES (?, ?, ?)",
                    [$entryId, $topic['topic'], $topic['confidence']]
                );
            }
        }
    }
    
    if ($generateHeroJourney) {
        $heroJourney = simulateHeroJourney($entry['content'], $entry['title']);
    }
    
    // Check if entry already has an analysis
    $existingAnalysis = $db->getOne(
        "SELECT analysis_id FROM ai_analysis WHERE entry_id = ?",
        [$entryId]
    );
    
    if ($existingAnalysis) {
        // Update existing analysis
        $result = $db->query(
            "UPDATE ai_analysis 
             SET mood_analysis = ?, topic_analysis = ?, hero_journey = ?
             WHERE entry_id = ?",
            [
                json_encode($moodAnalysis),
                json_encode($topicAnalysis),
                json_encode($heroJourney),
                $entryId
            ]
        );
    } else {
        // Create new analysis
        $result = $db->query(
            "INSERT INTO ai_analysis (entry_id, mood_analysis, topic_analysis, hero_journey)
             VALUES (?, ?, ?, ?)",
            [
                $entryId,
                json_encode($moodAnalysis),
                json_encode($topicAnalysis),
                json_encode($heroJourney)
            ]
        );
    }
    
    if (!$result) {
        sendServerError('Failed to save analysis');
        return;
    }
    
    // Get analysis ID
    $analysisId = $existingAnalysis ? $existingAnalysis['analysis_id'] : $result['insert_id'];
    
    sendSuccess([
        'analysis_id' => $analysisId,
        'mood_analysis' => $moodAnalysis,
        'topic_analysis' => $topicAnalysis,
        'hero_journey' => $heroJourney,
        'created_at' => date('Y-m-d H:i:s')
    ]);
}

/**
 * Handle get AI analysis for an entry
 * 
 * @param Database $db Database connection
 * @param array $params Route parameters
 * @param array $queryParams Query parameters
 * @param array $body Request body
 * @return void
 */
function handleGetAnalysis($db, $params, $queryParams, $body) {
    // Get authenticated user
    $user = requireAuth();
    
    // Get entry ID from route parameters
    $entryId = isset($params['id']) ? (int)$params['id'] : 0;
    
    // Check if entry exists and belongs to user
    $entry = $db->getOne(
        "SELECT entry_id FROM journal_entries WHERE entry_id = ? AND user_id = ?",
        [$entryId, $user['user_id']]
    );
    
    if (!$entry) {
        sendNotFound('Entry not found');
        return;
    }
    
    // Get analysis
    $analysis = $db->getOne(
        "SELECT analysis_id, mood_analysis, topic_analysis, hero_journey, created_at
         FROM ai_analysis
         WHERE entry_id = ?",
        [$entryId]
    );
    
    if (!$analysis) {
        sendNotFound('Analysis not found');
        return;
    }
    
    // Decode JSON fields
    $analysis['mood_analysis'] = json_decode($analysis['mood_analysis'], true);
    $analysis['topic_analysis'] = json_decode($analysis['topic_analysis'], true);
    $analysis['hero_journey'] = json_decode($analysis['hero_journey'], true);
    
    sendSuccess($analysis);
}

/**
 * Simulate mood analysis
 * 
 * @param string $content Journal entry content
 * @return array Mood analysis result
 */
function simulateMoodAnalysis($content) {
    // In a real implementation, this would use NLP or sentiment analysis
    // For this example, we'll return simulated results
    
    $moods = ['happy', 'sad', 'anxious', 'excited', 'calm', 'frustrated', 'grateful', 'reflective'];
    $primaryMood = $moods[array_rand($moods)];
    
    // Get a different mood for secondary
    $secondaryMoods = array_diff($moods, [$primaryMood]);
    $secondaryMood = $secondaryMoods[array_rand($secondaryMoods)];
    
    return [
        'primary_mood' => $primaryMood,
        'secondary_mood' => $secondaryMood,
        'mood_intensity' => rand(50, 95) / 100,
        'emotional_dimensions' => [
            'valence' => rand(-100, 100) / 100, // Negative to positive
            'arousal' => rand(-100, 100) / 100, // Calm to excited
            'dominance' => rand(-100, 100) / 100 // Submissive to dominant
        ],
        'mood_trends' => [
            'start' => $moods[array_rand($moods)],
            'middle' => $moods[array_rand($moods)],
            'end' => $primaryMood
        ]
    ];
}

/**
 * Simulate topic analysis
 * 
 * @param string $content Journal entry content
 * @return array Topic analysis result
 */
function simulateTopicAnalysis($content) {
    // In a real implementation, this would use topic modeling or keyword extraction
    // For this example, we'll return simulated results
    
    $possibleTopics = [
        'work', 'family', 'health', 'relationships', 'personal growth',
        'creativity', 'finance', 'travel', 'education', 'spirituality',
        'hobbies', 'goals', 'challenges', 'achievements', 'reflection'
    ];
    
    // Select 3-5 random topics
    $numTopics = rand(3, 5);
    $selectedTopics = [];
    $selectedTopicNames = [];
    
    for ($i = 0; $i < $numTopics; $i++) {
        // Get a topic that hasn't been selected yet
        $availableTopics = array_diff($possibleTopics, $selectedTopicNames);
        if (empty($availableTopics)) break;
        
        $topic = $availableTopics[array_rand($availableTopics)];
        $selectedTopicNames[] = $topic;
        
        $selectedTopics[] = [
            'topic' => $topic,
            'confidence' => (95 - ($i * 15) + rand(0, 10)) / 100, // Decreasing confidence
            'relevance' => (90 - ($i * 10) + rand(0, 10)) / 100 // Decreasing relevance
        ];
    }
    
    return [
        'topics' => $selectedTopics,
        'main_theme' => $selectedTopics[0]['topic'],
        'topic_relationships' => [
            ['from' => $selectedTopics[0]['topic'], 'to' => $selectedTopics[1]['topic'], 'strength' => rand(50, 90) / 100],
            ['from' => $selectedTopics[0]['topic'], 'to' => $selectedTopics[2]['topic'], 'strength' => rand(30, 70) / 100]
        ]
    ];
}

/**
 * Simulate hero's journey narrative
 * 
 * @param string $content Journal entry content
 * @param string $title Journal entry title
 * @return array Hero's journey result
 */
function simulateHeroJourney($content, $title) {
    // In a real implementation, this would use more sophisticated NLP
    // For this example, we'll return simulated results
    
    $journeyStages = [
        'Ordinary World',
        'Call to Adventure',
        'Refusal of the Call',
        'Meeting the Mentor',
        'Crossing the Threshold',
        'Tests, Allies, and Enemies',
        'Approach to the Inmost Cave',
        'Ordeal',
        'Reward',
        'The Road Back',
        'Resurrection',
        'Return with the Elixir'
    ];
    
    // Select a random stage for this entry
    $currentStage = $journeyStages[array_rand($journeyStages)];
    
    // Generate a narrative
    $narrative = "In this chapter of your journey, you find yourself in the \"$currentStage\" phase. ";
    $narrative .= "Your entry \"$title\" reveals how you are navigating this important stage. ";
    $narrative .= "The challenges you face now are preparing you for what lies ahead, and the insights you've gained will serve you well as your story continues to unfold.";
    
    return [
        'current_stage' => $currentStage,
        'narrative' => $narrative,
        'character_archetypes' => [
            'hero' => 'You embody the Hero archetype, facing challenges with courage',
            'mentor' => 'Your inner wisdom serves as your Mentor',
            'threshold_guardian' => 'Your doubts act as the Threshold Guardian you must overcome'
        ],
        'journey_progress' => array_search($currentStage, $journeyStages) / (count($journeyStages) - 1),
        'key_insights' => [
            'You are showing remarkable resilience in the face of challenges',
            'Your self-awareness is growing through reflection',
            'The connections between different aspects of your life are becoming clearer'
        ]
    ];
}
