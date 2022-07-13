import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StreamType } from 'src/app/enums/stream-type.enum';
import { VideoModel } from 'src/app/models/video.model';
import { base64encode, utf16to8 } from 'src/app/tools/base64';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.less'],
})
export class VideoPlayerComponent
  implements OnDestroy, OnInit, AfterViewInit, OnChanges
{
  @Input()
  url?: string;

  @Input()
  model?: VideoModel;

  @Input()
  webUrl: string = '/video/wsplayer/wsplayer.html';

  @Input()
  name: string = '';
  @Output()
  destroy: EventEmitter<VideoModel> = new EventEmitter();

  @Output()
  onStoping: EventEmitter<void> = new EventEmitter();
  @Output()
  onPlaying: EventEmitter<void> = new EventEmitter();
  @Output()
  getPosition: EventEmitter<number> = new EventEmitter();
  @Output()
  onButtonClicked: EventEmitter<ButtonName> = new EventEmitter();
  @Output()
  onViewerDoubleClicked: EventEmitter<void> = new EventEmitter();
  @Output()
  onRuleStateChanged: EventEmitter<boolean> = new EventEmitter();

  src?: SafeResourceUrl;

  getSrc(webUrl: string, url: string, cameraName?: string) {
    let result = webUrl + '?url=' + base64encode(url);
    if (cameraName) {
      let name = utf16to8(cameraName);
      result += '&name=' + base64encode(name);
    }
    return result;
  }

  @ViewChild('iframe')
  iframe!: ElementRef;

  private _player?: WSPlayerProxy;
  private get player(): WSPlayerProxy | undefined {
    if (!this.iframe || !this.iframe.nativeElement.contentWindow)
      return undefined;
    if (!this._player) {
      this._player = new WSPlayerProxy(this.iframe.nativeElement);
    }
    return this._player;
  }

  constructor(private sanitizer: DomSanitizer) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['model'] && !changes['model'].firstChange) {
      this.loaded = false;
    }
    this.load();
  }
  ngAfterViewInit(): void {
    this.load();
  }
  ngOnInit(): void {
    this.load();
  }

  loaded = false;

  load() {
    if (!this.loaded) {
      if (this.model) {
        this.url = this.model.toString();
      }

      if (this.url) {
        let src = this.getSrc(this.webUrl, this.url, this.name);
        this.src = this.sanitizer.bypassSecurityTrustResourceUrl(src);
        this.loaded = true;
      }
    }
  }

  ngOnDestroy(): void {
    if (this.registHandle) {
      clearTimeout(this.registHandle);
    }
    this.destroy.emit(this.model);
  }

  playing = false;

  _ruleState: boolean = false;

  stream: StreamType = StreamType.main;

  registHandle?: NodeJS.Timer;

  eventRegist() {
    if (this.player) {
      this.player.getPosition = (val: any) => {
        if (val >= 1) {
          this.playing = false;
        }
      };
      this.player.onPlaying = () => {
        setTimeout(() => {
          if (this._ruleState !== undefined && this.player) {
            this.changeRuleState(this._ruleState);
          }
        }, 1000);
        this.onPlaying.emit();
      };

      this.player.onStoping = () => {
        this.onStoping.emit();
      };
      this.player.getPosition = (value: number) => {
        this.getPosition.emit(value);
      };
      this.player.onButtonClicked = (btn: ButtonName) => {
        this.onButtonClicked.emit(btn);
      };
      this.player.onViewerDoubleClicked = () => {
        this.onViewerDoubleClicked.emit();
      };
    }
  }

  play(model: VideoModel) {
    this.model = model;
    this.loaded = false;
    this.load();
  }

  async stop() {
    if (this.player) {
      return this.player.stop();
    }
    return;
  }

  download(filename: string, type: string) {
    if (this.player) {
      this.player.download(filename, type);
    }
  }
  resize(width: number, height: number) {
    if (this.player) {
      this.player.resize(width, height);
    }
  }
  fullScreen() {
    if (this.player) {
      this.player.fullScreen();
    }
  }
  frame() {
    if (this.player) {
      this.player.frame();
    }
  }
  resume() {
    if (this.player) {
      this.player.resume();
    }
  }
  speedResume() {
    if (this.player) {
      this.player.speedResume();
    }
  }
  pause() {
    if (this.player) {
      this.player.pause();
    }
  }
  capturePicture() {
    if (this.player) {
      this.player.capturePicture();
    }
  }
  slow() {
    if (this.player) {
      this.player.slow();
    }
  }
  fast() {
    if (this.player) {
      this.player.fast();
    }
  }
  changeRuleState(state: boolean) {
    if (this.player) {
      this.player.changeRuleState(state);
    }
  }
  seek(value: number) {
    if (this.player) {
      this.player.seek(value);
    }
  }
}
