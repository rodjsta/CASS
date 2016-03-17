function insertNewCompetency() {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    $("#newCompetency").foundation('open');
}

function newCompetency(frameworkId) {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    var f = new EcCompetency();
    f.name = $("#newCompetencyName").val();
    f.description = $("#newCompetencyDescription").val();
    f.scope = $("#newCompetencyScope").val();
    f.generateId(repo.selectedServer);
    if (identity != null)
        f.addOwner(identity.ppk.toPk());
    EcRepository.save(f, function () {
        insertCompetencyIntoFramework(f.shortId(), frameworkId);
        $("#newCompetency").foundation('close');
    }, error);
}

function editCompetencyButton(me) {
    var competencyId = $(me).parents(".cass-competency").attr("url");
    editCompetency(competencyId);
}

function editCompetency(competencyId) {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    EcRepository.get(competencyId, function (competency) {
        $("#editCompetencyName").val(competency.name);
        $("#editCompetencyDescription").val(competency.description);
        $("#editCompetency").foundation('open');
    }, error);
}

function editCompetencySave() {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    var competencyId = $("#frameworks").find(".is-active").find(".cass-framework-competencies").find(".is-active").attr("url");
    EcRepository.get(competencyId, function (competency) {
        competency.name = $("#editCompetencyName").val();
        competency.description = $("#editCompetencyDescription").val();
        competency.scope = $("#editCompetencyScope").val();
        EcRepository.save(competency, function () {
            populateFramework(frameworkId);
            $("#editCompetency").foundation('close');
        }, error);
    }, error);
}

function editCompetencyDelete() {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    var competencyId = $("#frameworks").find(".is-active").find(".cass-framework-competencies").find(".is-active").attr("url");
    if (confirm("This will delete the selected competency. Continue?") == true)
        EcRepository.get(competencyId, function (competency) {
            EcRepository._delete(competency, function (response) {
                populateFramework(frameworkId);
                $("#editCompetency").foundation('close');
            }, error);
        });
}

function populateCompetency(id) {
    if (id == null) return;
    EcRepository.get(id, function (competency) {
        var ui = $("[url='" + competency.shortId() + "']");
        ui.children(".cass-competency-name").text(competency.name);
        ui.find(".cass-competency-description").text(competency.description);
        ui.find(".cass-competency-url").text(competency.shortId()).attr("href", competency.shortId());
        if (identity != null && competency.canEdit(identity.ppk.toPk()))
            $(".canEditCompetency").show();
        else
            $(".canEditCompetency").hide();
    }, error);
}

function insertExistingCompetency() {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }

    var searchString = "(@type:\"" + EcCompetency.myType + "\")";
    if ($("#insertExistingCompetencySearch").val() != "")
        searchString += " AND (" + $("#insertExistingCompetencySearch").val() + ")";
    repo.search(searchString, null,
        function (competencies) {
            $("#insertExistingCompetencyResults").html(competencyTemplate);
            $("#insertExistingCompetencyResults").children("#competency").html("");
            var results = $("#insertExistingCompetencyResults").children("#competency");
            for (var i = 0; i < competencies.length; i++) {
                var competency = competencies[i];
                results.append(cassCompetencyTemplate);
                var ui = results.children().last();
                ui.attr("url", competency.shortId());
                ui.find(".cass-competency-name").text(competency.name);
                ui.find(".cass-competency-description").text(competency.description);
                if ($("[url='" + frameworkId + "']").find("[url='" + competency.shortId() + "']").length > 0)
                    ui.find(".cass-competency-actions").prepend("<a class='button disabled float-right'>Exists</a>");
                else
                    ui.find(".cass-competency-actions").prepend("<a class='button float-right' onclick='insertExistingCompetencyIntoFramework();'>Insert</a>");
                ui.find(".cass-competency-relations").html("");
            }
            results.foundation();
            $("#insertExistingCompetency").foundation('open');
        }, error
    );
}

$("body").on("click", ".cass-competency", null, function (e) {
    e.stopPropagation();
    (function (url) {
        setTimeout(function(){populateCompetency(url);},0);
    })($(this).attr("url"));
}, error);
