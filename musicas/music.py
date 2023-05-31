import os
import subprocess
from dataclasses import dataclass

@dataclass
class Codec:
    ext: str
    acodec: str
    mux: str

wav  = Codec("wav" , "s161", "wav"  )
opus = Codec("opus", "opus", "ogg"  )
ogg  = Codec("ogg" , "flac", "ogg"  )
mp3  = Codec("mp3" , "mp3" , "dummy")
flac = Codec("flac", "flac", "ogg"  )

def convert(spec: Codec, file_from: str, file_to: str) -> None:
    convert_string = f"#transcode{{acodec={spec.acodec},channels=2}}:standard{{access=file,mux={spec.mux},dst={file_to}}}"
    commands: list[str] = [
        r"C:\Program Files\VideoLAN\VLC\vlc.exe",
        file_from,
        "--sout",
        convert_string,
        "vlc://quit"
    ]
    print(" ".join(commands))
    s = subprocess.Popen(commands, stdout = subprocess.PIPE)
    s.wait()

def from_mid(p: str) -> None:
    for k: Codec in [wav, opus, ogg, mp3, flac]:
        target = p.replace("\\mid-src\\", "\\" + k.ext + "\\").replace(".mid", "." + k.ext)
        convert(k, p, target)

def from_wav(p: str) -> None:
    for k: Codec in [opus, ogg, mp3, flac]:
        target = p.replace("\\wav-src\\", "\\" + k.ext + "\\").replace(".wav", "." + k.ext)
        convert(k, p, target)

def all_mids() -> None:
    dir: str = os.path.abspath("..\\mid-src\\")
    for p: str in os.listdir(dir):
        from_mid(os.path.join(dir, p))

def all_wavs() -> None:
    dir: str = os.path.abspath("..\\wav-src\\")
    for p: str in os.listdir(dir):
        from_wav(os.path.join(dir, p))

all_mids()
all_wavs()
