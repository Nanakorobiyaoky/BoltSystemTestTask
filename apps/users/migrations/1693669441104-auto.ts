import { MigrationInterface, QueryRunner } from 'typeorm';

export class Auto1693669441104 implements MigrationInterface {
  name = 'Auto1693669441104';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`client_user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`full_name\` varchar(255) NOT NULL, \`role\` enum ('author', 'editor') NOT NULL DEFAULT 'author', \`may_publish\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`IDX_57737f7835a77e39967ab4b0d0\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`system_user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`role\` enum ('admin') NOT NULL DEFAULT 'admin', UNIQUE INDEX \`IDX_741d321efeff6cfdf96dce44f8\` (\`email\`), UNIQUE INDEX \`IDX_dbfcda425aea56cd4757db1c53\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_dbfcda425aea56cd4757db1c53\` ON \`system_user\``);
    await queryRunner.query(`DROP INDEX \`IDX_741d321efeff6cfdf96dce44f8\` ON \`system_user\``);
    await queryRunner.query(`DROP TABLE \`system_user\``);
    await queryRunner.query(`DROP INDEX \`IDX_57737f7835a77e39967ab4b0d0\` ON \`client_user\``);
    await queryRunner.query(`DROP TABLE \`client_user\``);
  }
}
