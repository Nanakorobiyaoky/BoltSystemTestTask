import { MigrationInterface, QueryRunner } from 'typeorm';

export class Auto1693942208425 implements MigrationInterface {
  name = 'Auto1693942208425';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`system_user\` CHANGE \`id\` \`id\` int NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`system_user\` DROP PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`system_user\` DROP COLUMN \`id\``);
    await queryRunner.query(`ALTER TABLE \`system_user\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`client_user\` CHANGE \`id\` \`id\` int NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`client_user\` DROP PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`client_user\` DROP COLUMN \`id\``);
    await queryRunner.query(`ALTER TABLE \`client_user\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
    await queryRunner.query(
      "insert into system_user (id, email, password, name) values ('e4200e5e-0e7e-4098-8dd7-76d9470e7515', 'admin', '$2b$05$8vpRmOv2pmsWJJ/HSC2syeoFZyONVToH0hjGqIDjSMP7T8oOlmq1q', 'admin')",
    );
    await queryRunner.query(
      "insert into client_user (id, email, password, full_name, role) values ('05328bbd-c73d-4759-8e50-4e1c9edf50c6', 'editor@gmail.com', '$2b$05$ud.82jcyW.Z1FeEC.LywP.QjdQfMsocMlfO6ab9EwRVpAZ44fiqFG', 'editor', 'editor')",
    );
    await queryRunner.query(
      "insert into client_user (id, email, password, full_name, role) values ('172f68cc-9db7-412b-a886-ad94c4896448', 'author@gmail.com', '$2b$05$QYKxGst4z.TRsvnhgvrnuOVNv5YnGyKuW32mZMxM9sGEywFG7Y5ma', 'author', 'author')",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`client_user\` DROP COLUMN \`id\``);
    await queryRunner.query(`ALTER TABLE \`client_user\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
    await queryRunner.query(`ALTER TABLE \`client_user\` ADD PRIMARY KEY (\`id\`)`);
    await queryRunner.query(`ALTER TABLE \`client_user\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
    await queryRunner.query(`ALTER TABLE \`system_user\` DROP COLUMN \`id\``);
    await queryRunner.query(`ALTER TABLE \`system_user\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
    await queryRunner.query(`ALTER TABLE \`system_user\` ADD PRIMARY KEY (\`id\`)`);
    await queryRunner.query(`ALTER TABLE \`system_user\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
  }
}
