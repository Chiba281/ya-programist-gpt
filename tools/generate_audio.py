"""Generate one Ukrainian MP3 per lesson; only original study scripts are sent."""
import asyncio, json, hashlib, sys
from pathlib import Path
import edge_tts
ROOT=Path(__file__).resolve().parent.parent
DATA=json.loads((ROOT/'tools'/'podcasts.json').read_text(encoding='utf-8'))
VOICE='uk-UA-OstapNeural'
RATE='-5%'

def valid(p):
    if not p.is_file() or p.stat().st_size<1024:return False
    with p.open('rb') as f:b=f.read(3)
    return b==b'ID3' or (len(b)>=2 and b[0]==255 and b[1]&224==224)

async def main():
    audio=ROOT/'audio';audio.mkdir(exist_ok=True)
    statefile=audio/'generated_manifest.json'
    try:state=json.loads(statefile.read_text(encoding='utf-8'))
    except (OSError,ValueError):state={}
    if not isinstance(state,dict):state={}
    total=len(DATA);failed=[]
    for n,l in enumerate(DATA,1):
        name=f"{l['id']}-full-v144.mp3";dst=audio/name;temp=audio/(name+'.part')
        script='\n\n'.join(p['title']+'. '+p['text'] for p in l['parts'])
        digest=hashlib.sha256((VOICE+RATE+script).encode()).hexdigest()
        if state.get(name)==digest and valid(dst):print(f'[{n}/{total}] Already done: {name}',flush=True);continue
        print(f'[{n}/{total}] Generating: {name}',flush=True)
        for attempt in range(3):
            try:
                await asyncio.wait_for(edge_tts.Communicate(script,VOICE,rate=RATE).save(str(temp)),timeout=600)
                if not valid(temp):raise RuntimeError('MP3 is empty or invalid')
                temp.replace(dst);state[name]=digest;statefile.write_text(json.dumps(state,indent=2),encoding='utf-8');print(f'[{n}/{total}] OK: {name}',flush=True);break
            except Exception as e:
                temp.unlink(missing_ok=True);print(f'[{n}/{total}] Attempt {attempt+1}: {name}: {e}',flush=True)
                if attempt==2:failed.append(name)
                else:await asyncio.sleep(2*(attempt+1))
    print(f'Completed: {total-len(failed)}/{total}');return 1 if failed else 0
if __name__=='__main__':sys.exit(asyncio.run(main()))
