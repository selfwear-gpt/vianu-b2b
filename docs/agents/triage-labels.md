# Triage Labels

Der Skill `triage` ist archiviert (`.claude/skills-archiv/`), weil es keine eingehenden Meldungen von Dritten gibt. `to-spec` und `to-tickets` verwenden aber weiter den Status `ready-for-agent`. Deshalb gilt diese Tabelle weiter, und der Status steht als `Status:`-Zeile in der Aufgabendatei (siehe `issue-tracker.md`).

The skills speak in terms of five canonical triage roles. This file maps those roles to the actual label strings used in this repo's issue tracker.

| Label in mattpocock/skills | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`               | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent`          | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human`          | `ready-for-human`    | Requires human implementation            |
| `wontfix`                  | `wontfix`            | Will not be actioned                     |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label string from this table.

Edit the "Label in our tracker" column to match whatever vocabulary you actually use.
