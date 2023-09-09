import { MigrationInterface, QueryRunner } from 'typeorm';

export class Auto1694277677840 implements MigrationInterface {
  name = 'Auto1694277677840';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`publications\` CHANGE \`image\` \`image\` varchar(255) NOT NULL DEFAULT ''`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`publications\` CHANGE \`image\` \`image\` varchar(255) NULL`);
  }
}
