import { MigrationInterface, QueryRunner } from 'typeorm';

export class Auto1694018929540 implements MigrationInterface {
  name = 'Auto1694018929540';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`publications\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(150) NOT NULL, \`content\` varchar(255) NOT NULL, \`image\` varchar(255) NULL, \`author_id\` varchar(255) NOT NULL, \`is_published\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_e8ac574061eb8d24da1d6c512e\` (\`title\`), UNIQUE INDEX \`IDX_42091ee93eac7ad2c85e5cdd28\` (\`content\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_42091ee93eac7ad2c85e5cdd28\` ON \`publications\``);
    await queryRunner.query(`DROP INDEX \`IDX_e8ac574061eb8d24da1d6c512e\` ON \`publications\``);
    await queryRunner.query(`DROP TABLE \`publications\``);
  }
}
