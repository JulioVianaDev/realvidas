import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import {
  renderLoginCodeEmail,
  renderResetPasswordEmail,
} from '@email-templates/index';
import { MailTemplateType } from './dto/send-template.dto';

interface Attachment {
  filename: string;
  path: string;
}

type TemplateRenderer = (
  params: Record<string, unknown>,
) => Promise<string>;

const TEMPLATE_REGISTRY: Record<
  MailTemplateType,
  { render: TemplateRenderer; defaultSubject: string }
> = {
  [MailTemplateType.RESET_PASSWORD]: {
    render: (params) => {
      const themeRaw = params.theme as string | undefined;
      const theme =
        themeRaw != null && String(themeRaw).toLowerCase() === 'dark'
          ? 'dark'
          : 'light';
      return renderResetPasswordEmail({
        resetUrl: params.resetUrl as string,
        userName: params.userName as string | undefined,
        language: params.language as 'en-US' | 'pt-BR' | undefined,
        theme,
        baseUrl: params.baseUrl as string | undefined,
      });
    },
    defaultSubject: 'Reset your password',
  },
  [MailTemplateType.LOGIN_CODE]: {
    render: (params) => {
      const themeRaw = params.theme as string | undefined;
      const theme =
        themeRaw != null && String(themeRaw).toLowerCase() === 'dark'
          ? 'dark'
          : 'light';
      return renderLoginCodeEmail({
        validationCode: params.validationCode as string | undefined,
        language: params.language as 'en-US' | 'pt-BR' | undefined,
        loginUrl: params.loginUrl as string | undefined,
        baseUrl: params.baseUrl as string | undefined,
        theme,
      });
    },
    defaultSubject: 'Your login code',
  },
};

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    html: string,
    attachments?: Attachment[],
  ) {
    try {
      const fromAddress =
        this.configService.get<string>('SMTP_FROM') ||
        this.configService.get<string>('SMTP_USER');
      if (!fromAddress?.trim()) {
        throw new Error(
          'SMTP From address is not set. Set SMTP_FROM or SMTP_USER in .env',
        );
      }
      const info = await this.transporter.sendMail({
        from: fromAddress.trim(),
        to,
        subject,
        html,
        attachments,
      });
      return info;
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendByTemplateType(options: {
    to: string;
    subject?: string;
    templateType: MailTemplateType;
    params: Record<string, unknown>;
  }) {
    const entry = TEMPLATE_REGISTRY[options.templateType];
    if (!entry) {
      throw new Error(
        `Unknown template type: ${options.templateType}`,
      );
    }
    const html = await entry.render(options.params);
    const subject = options.subject ?? entry.defaultSubject;
    return this.sendMail(options.to, subject, html);
  }
}
