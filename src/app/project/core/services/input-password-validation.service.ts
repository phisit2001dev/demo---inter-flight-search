import { Injectable } from '@angular/core';

interface initConfigPassword {
  index: number,
  value?: any
}

@Injectable()
export class InputPasswordValidationService {

  private readonly replace = '%val'
  private readonly formatConfig = [
    {exp: `.{${this.replace},}`, hint: `Password must be at least (${this.replace}) character long.` },
    {exp: '^(?=.*[0-9]).*$', hint: 'Password must contain number' },
    {exp: '^(?=.*[A-Z]).*$', hint: 'Password must contain an uppercase letter.' },
    {exp: '^(?=.*[a-z]).*$', hint: 'Password must contain a lowercase letter.' },
    {exp: '[!@#$%&*()^_+=|<>?{}\\[\\]~-]', hint: 'Password must contain a special character.' },
  ]

  getConfigPassword(initConfig: initConfigPassword[]){
    let config = [];
    if (config.length <= this.formatConfig.length) {
      initConfig.forEach((cfg) => {
        let format = this.formatConfig[cfg.index];
        if (format) {
          if (cfg.value) {
            format.exp = format.exp.replace(this.replace,cfg.value);
            format.hint = format.hint.replace(this.replace,cfg.value);
          }
          config.push(format);
        }
      })
    }
    return config;
  }
}
