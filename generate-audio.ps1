# PowerShell script to generate TTS audio files for IELTS Listening tests

Add-Type -AssemblyName System.Speech

function Create-AudioFile {
    param(
        [string]$Text,
        [string]$OutputPath,
        [string]$VoiceName = "Microsoft David Desktop"
    )
    
    $synthesizer = New-Object System.Speech.Synthesis.SpeechSynthesizer
    
    # Try to set voice
    try {
        $synthesizer.SelectVoice($VoiceName)
    } catch {
        Write-Host "Voice '$VoiceName' not found. Using default voice."
    }
    
    # Configure speech settings
    $synthesizer.Rate = -2  # Slightly slower for IELTS
    $synthesizer.Volume = 100
    
    # Save to WAV file
    $synthesizer.SetOutputToWaveFile($OutputPath)
    $synthesizer.Speak($Text)
    $synthesizer.Dispose()
    
    Write-Host "Created: $OutputPath"
}

# Create audio directory if it doesn't exist
$audioDir = "uploads\audio"
if (!(Test-Path $audioDir)) {
    New-Item -ItemType Directory -Path $audioDir -Force
}

# Audio content for each listening test
$audioContent = @{
    "listening-1" = "Woman: Good morning, how can I help you today? Man: Hello, I'm Doctor Johnson. I have an appointment with Mrs. Patterson at 10 AM. I need to discuss her surgery results. Woman: Of course, Doctor. She's waiting in room 3. Here are her medical charts. Man: Thank you. I'll review these before going in."
    
    "listening-2" = "Nurse: Doctor Smith, the patient in bed 7 needs his medication. Doctor: I'll check on him right after I finish this surgery consultation. Can you please prepare the wheelchair for Mrs. Brown's discharge? Nurse: Already done. The hospital pharmacy has also prepared her prescription. Doctor: Excellent. Please call the ambulance for the emergency patient in the waiting room."
    
    "listening-3" = "Secretary: Doctor Williams, don't forget about the medical conference today. Doctor Williams: What time does it start again? Secretary: The meeting begins at 10 AM sharp in the main auditorium. All department heads need to be there. Doctor Williams: Thank you for reminding me. I'll be there at 9:45 AM to prepare."
    
    "listening-4" = "Organizer: Good morning everyone. Welcome to the International Medical Conference. Assistant: Sir, how many participants do we have today? Organizer: We have exactly 150 medical professionals from 25 different countries. This is our largest conference yet. Assistant: That's impressive. The main hall can accommodate up to 200 people, so we have good capacity."
}

# Generate audio files
foreach ($key in $audioContent.Keys) {
    $outputPath = "$audioDir\$key.wav"
    Create-AudioFile -Text $audioContent[$key] -OutputPath $outputPath
}

Write-Host "`nAll audio files created successfully!"
Write-Host "Files created in: $audioDir"
