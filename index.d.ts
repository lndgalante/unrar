// Type definitions

export interface Options {
  src: string;
  dest: string;
  command?: string;
  switches?: string[];
}

/**
 * uncompress .rar file
 *  - `src` source file path
 *  - `dest` destination folder path
 *  - `command` command of unrar, default: x
 *  - `switches` switches of unrar, default: []
 */
export function uncompress(options: Options): Promise<'over'>;

export function on(
  event: 'progress',
  listener: (percent: number) => void
): void;

export function on(
  event: 'folders',
  listener: (folders: string[]) => void
): void;

export function kill(): void;

export type UnrarError = { code: string; archive: string };
