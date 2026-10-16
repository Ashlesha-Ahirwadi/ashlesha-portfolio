"""Record Kiki's voice clips (free, offline) with Kokoro TTS.

Voice: Kokoro "af_heart", pitched up into a chipmunk-cartoon voice.
Writes kiki/voice/<id>.mp3 for every line in brain.js.

Setup once:  brew install espeak-ng ffmpeg && pip install "kokoro>=0.9.4" soundfile
Run:         ESPEAK_DATA_PATH=/opt/homebrew/share/espeak-ng-data python kiki/tools/make_voice.py [id ...]
(no ids = re-record everything; pass ids to re-record just those lines)
"""
import json, os, re, subprocess, sys
import numpy as np, soundfile as sf
from kokoro import KPipeline

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'voice')
VOICE, PITCH, SPEED = 'af_heart', 1.65, 1.18

# Spoken spellings for words the voice model mispronounces (text on screen is unchanged).
SAY_AS = {
    'Qwen': 'Kwen', 'LoRA-tuned': 'Laura tuned', 'SARIMAX': 'Sarimax', 'TiDE': 'Tide',
    'TS-Mixer': 'T S Mixer', 'LSTM': 'L S T M', 'CI CD': 'C I C D', 'AUC': 'A U C',
    'F1': 'F one', 'GPT-2': 'G P T 2', 'mmWave': 'millimeter wave', 'MediCurious': 'Medi-curious',
    'AutoGen': 'Auto Gen', 'LlamaIndex': 'Llama Index', 'MLflow': 'M L flow', 'RAG': 'rag',
    'Ashlesha': 'Uh-shlay-shuh', 'uh-SHLAY-shuh': 'uh-shlay-shuh', 'Ruvaah': 'Roo-vah', 'ruvaah': 'roo-vah',
    'roo-VAH': 'roo-vah', 'NASDAQ-100': 'NASDAQ one hundred', 'CI/CD': 'C I C D', 'READMEs': 'read-mees',
    'GenAI': 'Gen A I', 'Three.js': 'Three J S', 'LangGraph': 'Lang Graph', 'FastAPI': 'Fast A P I',
    'ICU': 'I C U', 'EEG': 'E E G', 'IT': 'I T', 'ML': 'M L', 'DRDO': 'D R D O', 'TSA': 'T S A',
    'PreCheck': 'Pre-Check', 'AWS': 'A W S', 'LLM': 'L L M', 'NLP': 'N L P', 'CRM': 'C R M', 'MRI': 'M R I',
}

def spoken(text):
    for k, v in SAY_AS.items():
        text = re.sub(r'(?<![\w-])' + re.escape(k) + r'(?![\w-])', v, text)
    return text

def main():
    lines = json.loads(subprocess.check_output(['node', os.path.join(HERE, 'export_lines.js')]))
    only = set(sys.argv[1:])
    os.makedirs(OUT, exist_ok=True)
    tts = KPipeline(lang_code='a')
    for lid, text in lines.items():
        if only and lid not in only:
            continue
        audio = np.concatenate([a.numpy() for _, _, a in tts(spoken(text), voice=VOICE, speed=1.0)])
        wav = os.path.join(OUT, lid + '.wav')
        sf.write(wav, audio, 24000)
        fx = f'asetrate={int(24000 * PITCH)},aresample=24000,atempo={SPEED / PITCH:.4f},treble=g=3'
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-af', fx, '-b:a', '80k',
                        os.path.join(OUT, lid + '.mp3')], check=True)
        os.remove(wav)
        print('recorded', lid)

if __name__ == '__main__':
    main()
